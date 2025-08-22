const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const { db } = require('../config/database');
const logger = require('../utils/logger');

class PBRScraper {
  constructor() {
    this.baseUrl = process.env.PBR_SCHEDULE_URL || 'https://pbr.com/watch/';
    this.userAgent = process.env.SCRAPING_USER_AGENT || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
    this.browser = null;
  }

  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      logger.info('PBR Scraper browser initialized');
    } catch (error) {
      logger.error('Failed to initialize browser:', error);
      throw error;
    }
  }

  async scrapeEvents() {
    try {
      if (!this.browser) {
        await this.initialize();
      }

      const page = await this.browser.newPage();
      await page.setUserAgent(this.userAgent);
      await page.setViewport({ width: 1920, height: 1080 });

      // Navigate to PBR schedule page
      await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for content to load
      await page.waitForSelector('.event-schedule', { timeout: 10000 });

      // Get page content
      const content = await page.content();
      const $ = cheerio.load(content);

      const events = [];

      // Extract event information from the schedule
      $('.event-item, .event-schedule-item').each((index, element) => {
        try {
          const event = this.parseEventElement($, element);
          if (event) {
            events.push(event);
          }
        } catch (error) {
          logger.error(`Error parsing event element ${index}:`, error);
        }
      });

      // If no events found with primary selectors, try alternative selectors
      if (events.length === 0) {
        $('[class*="event"], [class*="schedule"]').each((index, element) => {
          try {
            const event = this.parseAlternativeEventElement($, element);
            if (event) {
              events.push(event);
            }
          } catch (error) {
            logger.error(`Error parsing alternative event element ${index}:`, error);
          }
        });
      }

      await page.close();
      
      logger.info(`Scraped ${events.length} PBR events`);
      return events;

    } catch (error) {
      logger.error('Error scraping PBR events:', error);
      throw error;
    }
  }

  parseEventElement($, element) {
    try {
      const $el = $(element);
      
      // Extract event details
      const title = $el.find('h2, h3, .event-title, .title').first().text().trim();
      const dateText = $el.find('.date, .event-date, [class*="date"]').first().text().trim();
      const location = $el.find('.location, .event-location, [class*="location"]').first().text().trim();
      const timeText = $el.find('.time, .event-time, [class*="time"]').first().text().trim();
      const platform = $el.find('.platform, .channel, [class*="platform"]').first().text().trim();
      
      // Extract additional details
      const description = $el.find('.description, .event-description, [class*="description"]').first().text().trim();
      const imageUrl = $el.find('img').first().attr('src') || '';
      
      if (!title || !dateText) {
        return null;
      }

      // Parse date and time
      const { startDate, endDate } = this.parseDateRange(dateText);
      const { startTime, endTime } = this.parseTimeRange(timeText);

      // Determine streaming platform
      const streamingPlatform = this.determineStreamingPlatform(platform, title, description);

      const event = {
        title: title,
        description: description || '',
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        location: location || '',
        streamingPlatform: streamingPlatform,
        imageUrl: imageUrl,
        status: 'upcoming',
        scrapedAt: new Date(),
        rawData: {
          dateText,
          timeText,
          platform,
          elementHtml: $el.html()
        }
      };

      return event;
    } catch (error) {
      logger.error('Error parsing event element:', error);
      return null;
    }
  }

  parseAlternativeEventElement($, element) {
    try {
      const $el = $(element);
      const text = $el.text();
      
      // Look for patterns that indicate an event
      if (text.includes('PBR') || text.includes('Bull') || text.includes('Riding')) {
        const title = $el.find('h1, h2, h3, h4, h5, h6').first().text().trim() || 'PBR Event';
        const dateMatch = text.match(/(\w{3}\s+\d{1,2})/);
        const locationMatch = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
        
        if (dateMatch) {
          return {
            title: title,
            description: text.substring(0, 200) + '...',
            startDate: new Date(),
            endDate: new Date(),
            startTime: null,
            endTime: null,
            location: locationMatch ? locationMatch[1] : '',
            streamingPlatform: 'unknown',
            imageUrl: '',
            status: 'upcoming',
            scrapedAt: new Date(),
            rawData: { text, elementHtml: $el.html() }
          };
        }
      }
      
      return null;
    } catch (error) {
      logger.error('Error parsing alternative event element:', error);
      return null;
    }
  }

  parseDateRange(dateText) {
    try {
      // Handle various date formats
      const datePatterns = [
        /(\w{3}\s+\d{1,2})\s*-\s*(\w{3}\s+\d{1,2})/i,  // Aug 22 - 24
        /(\w{3}\s+\d{1,2})/i,  // Aug 22
        /(\d{1,2}\/\d{1,2})/   // 8/22
      ];

      let startDate = new Date();
      let endDate = new Date();

      for (const pattern of datePatterns) {
        const match = dateText.match(pattern);
        if (match) {
          if (match[2]) {
            // Date range
            startDate = this.parseDate(match[1]);
            endDate = this.parseDate(match[2]);
          } else {
            // Single date
            startDate = this.parseDate(match[1]);
            endDate = new Date(startDate);
          }
          break;
        }
      }

      return { startDate, endDate };
    } catch (error) {
      logger.error('Error parsing date range:', error);
      return { startDate: new Date(), endDate: new Date() };
    }
  }

  parseTimeRange(timeText) {
    try {
      const timePattern = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
      const match = timeText.match(timePattern);
      
      if (match) {
        let hour = parseInt(match[1]);
        const minute = parseInt(match[2]);
        const period = match[3].toUpperCase();
        
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endTime = `${(hour + 2).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        return { startTime, endTime };
      }
      
      return { startTime: null, endTime: null };
    } catch (error) {
      logger.error('Error parsing time range:', error);
      return { startTime: null, endTime: null };
    }
  }

  parseDate(dateStr) {
    try {
      const currentYear = new Date().getFullYear();
      const date = new Date(`${dateStr} ${currentYear}`);
      
      // If the date is in the past, assume it's for next year
      if (date < new Date()) {
        date.setFullYear(currentYear + 1);
      }
      
      return date;
    } catch (error) {
      logger.error('Error parsing date:', error);
      return new Date();
    }
  }

  determineStreamingPlatform(platform, title, description) {
    const text = `${platform} ${title} ${description}`.toLowerCase();
    
    if (text.includes('fox nation') || text.includes('fox')) {
      return 'fox_nation';
    } else if (text.includes('cw') || text.includes('cw network')) {
      return 'cw';
    } else if (text.includes('cbs') || text.includes('hulu')) {
      return 'cbs';
    } else if (text.includes('ridepass') || text.includes('pluto')) {
      return 'ridepass';
    } else {
      return 'unknown';
    }
  }

  async saveEventsToDatabase(events) {
    try {
      for (const event of events) {
        // Check if event already exists
        const existingEvent = await db('events')
          .where({
            title: event.title,
            startDate: event.startDate
          })
          .first();

        if (!existingEvent) {
          // Insert new event
          const [eventId] = await db('events').insert(event).returning('id');
          logger.info(`New PBR event saved: ${event.title} (ID: ${eventId})`);
          
          // Schedule recording if event is upcoming
          if (event.status === 'upcoming') {
            await this.scheduleRecording(eventId, event);
          }
        } else {
          // Update existing event
          await db('events')
            .where('id', existingEvent.id)
            .update({
              ...event,
              updatedAt: new Date()
            });
          logger.info(`PBR event updated: ${event.title}`);
        }
      }
    } catch (error) {
      logger.error('Error saving events to database:', error);
      throw error;
    }
  }

  async scheduleRecording(eventId, event) {
    try {
      // Create recording schedule
      const recordingSchedule = {
        eventId: eventId,
        status: 'scheduled',
        scheduledStartTime: new Date(event.startDate),
        scheduledEndTime: new Date(event.endDate),
        streamingPlatform: event.streamingPlatform,
        createdAt: new Date()
      };

      await db('recording_schedules').insert(recordingSchedule);
      logger.info(`Recording scheduled for event: ${event.title}`);
    } catch (error) {
      logger.error('Error scheduling recording:', error);
    }
  }

  async cleanup() {
    try {
      if (this.browser) {
        await this.browser.close();
        logger.info('PBR Scraper browser closed');
      }
    } catch (error) {
      logger.error('Error closing browser:', error);
    }
  }
}

module.exports = PBRScraper;

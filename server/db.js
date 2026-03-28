import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const db = new Database(join(__dirname, 'mindscape.db'))

export function initDB() {
  // Enable WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL')
  db.pragma('synchronous = NORMAL')

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS mood_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      score INTEGER NOT NULL CHECK(score BETWEEN 1 AND 10),
      text TEXT DEFAULT '',
      stressors TEXT DEFAULT '[]',
      department TEXT DEFAULT 'General',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      level TEXT DEFAULT 'warning',
      department TEXT DEFAULT 'General',
      created_at TEXT NOT NULL,
      resolved INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      url TEXT,
      icon TEXT DEFAULT '📖'
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin'
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      organization_id INTEGER,
      created_at TEXT NOT NULL,
      last_login TEXT,
      FOREIGN KEY (organization_id) REFERENCES organizations(id)
    );

    CREATE TABLE IF NOT EXISTS organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL,
      last_login TEXT
    );

    -- Performance indexes
    CREATE INDEX IF NOT EXISTS idx_mood_created_at ON mood_entries(created_at);
    CREATE INDEX IF NOT EXISTS idx_mood_session ON mood_entries(session_id);
    CREATE INDEX IF NOT EXISTS idx_mood_department ON mood_entries(department);
    CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(resolved);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_organization ON users(organization_id);
    CREATE INDEX IF NOT EXISTS idx_organizations_email ON organizations(email);
  `)

  // Seed resources if empty (these are static content, not user data)
  const resourceCount = db.prepare('SELECT COUNT(*) as c FROM resources').get()
  if (resourceCount.c === 0) {
    seedResources()
  }

  console.log('✅ Database initialized (production mode — no demo data)')
}

function seedResources() {
  const insertResource = db.prepare(`
    INSERT INTO resources (title, description, category, url, icon)
    VALUES (?, ?, ?, ?, ?)
  `)

  const resources = [
    ['5-Minute Mindfulness', 'A quick guided meditation to reset your mind between classes. Focus on your breathing and let go of stress.', 'Mindfulness', 'https://www.headspace.com/meditation/5-minute-meditation', '🧘'],
    ['Sleep Hygiene Guide', 'Evidence-based tips for better sleep quality. Learn about sleep cycles, bedtime routines, and screen time management.', 'Sleep', 'https://www.sleepfoundation.org/sleep-hygiene', '😴'],
    ['Beating Exam Anxiety', 'Cognitive strategies for managing test-related stress. Includes preparation techniques and in-the-moment calming exercises.', 'Stress', 'https://www.apa.org/topics/anxiety/test', '💪'],
    ['Building Connection', 'Tips for combating isolation and building meaningful friendships on campus. Join clubs, study groups, and social events.', 'Social', 'https://www.mentalhealth.org.uk/explore-mental-health/a-z-topics/loneliness', '🤝'],
    ['Nutrition & Mood', 'How diet directly affects your mental well-being. Learn about brain foods, hydration, and meal planning.', 'Wellness', 'https://www.health.harvard.edu/blog/nutritional-psychiatry-your-brain-on-food-201511168626', '🥗'],
    ['Digital Detox Guide', 'Taking healthy breaks from social media for better mental health. Set boundaries and find real-world alternatives.', 'Lifestyle', 'https://www.healthline.com/health/mental-health/digital-detox', '📵'],
    ['Journaling for Mental Health', 'How expressive writing can help process emotions and reduce stress. Includes prompts and techniques.', 'Mindfulness', 'https://www.urmc.rochester.edu/encyclopedia/content.aspx?ContentID=4552&ContentTypeID=1', '📝'],
    ['Exercise & Endorphins', 'The science behind how physical activity boosts mood. Simple workout routines for busy students.', 'Wellness', 'https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/exercise-and-stress/art-20044469', '🏃'],
    ['Financial Stress Management', 'Practical budgeting tips and resources for students dealing with financial anxiety.', 'Lifestyle', 'https://studentaid.gov/resources', '💰'],
    ['Time Management Mastery', 'Techniques like Pomodoro, time-blocking, and prioritization to reduce academic overwhelm.', 'Stress', 'https://learningcenter.unc.edu/tips-and-tools/time-management/', '⏰']
  ]

  const insertMany = db.transaction(() => {
    resources.forEach(r => insertResource.run(...r))
  })
  insertMany()

  console.log('📚 Resources seeded (static content)')
}

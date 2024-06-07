const sqlite3 = require("sqlite3");

const dbFilePath = "todos.db";
// Open SQLite database connection
// const db = new sqlite3.Database(":memory:");
const db = new sqlite3.Database(dbFilePath);

// Create todos table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY,
    task TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert data
const tasksArray = [
  "React",
  "Next.js",
  "Node",
  "JavaScript",
  "Java",
  "PHP",
  "Python",
  "C#",
  "Ruby",
  "Go",
  "Kotlin",
  "Swift",
  "Objective-C",
  "TypeScript",
  "Vue.js",
  "Angular",
  "Ember.js",
  "Svelte",
  "Django",
  "Flask",
  "Spring Boot",
  "Express.js",
  "Laravel",
  "Symfony",
  "CodeIgniter",
  "Rails",
  "ASP.NET",
  "Hibernate",
  "jQuery",
  "Bootstrap",
  "Tailwind CSS",
  "Bulma",
  "Foundation",
  "LESS",
  "Sass",
  "Stylus",
  "PostCSS",
  "Webpack",
  "Rollup",
  "Parcel",
  "Grunt",
  "Gulp",
  "Mocha",
  "Jest",
  "Chai",
  "Jasmine",
  "Cucumber",
  "Cypress",
  "Puppeteer",
  "Selenium",
  "Protractor",
  "TestCafe",
  "Redux",
  "MobX",
  "Recoil",
  "RxJS",
  "NgRx",
  "Vuex",
  "Pinia",
  "Apollo",
  "Relay",
  "GraphQL",
  "REST",
  "SOAP",
  "gRPC",
  "WebSockets",
  "Socket.IO",
  "MQTT",
  "Kafka",
  "RabbitMQ",
  "ZeroMQ",
  "Redis",
  "Memcached",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "SQLite",
  "MariaDB",
  "Cassandra",
  "Elasticsearch",
  "Solr",
  "DynamoDB",
  "Firestore",
  "CouchDB",
  "PouchDB",
  "RethinkDB",
  "ArangoDB",
  "HBase",
  "Bigtable",
  "Presto",
  "Trino",
  "Hive",
  "Spark",
  "Flink",
  "Kafka Streams",
  "Samza",
  "Beam",
  "Airflow",
  "Luigi",
  "Oozie",
  "NiFi",
];

db.serialize(() => {
  tasksArray.forEach((task) => {
    const query = `INSERT INTO todos (task) VALUES (?)`;
    db.run(query, [task], (err) => {
      if (err) {
        console.error(`Error inserting task ${task}:`, err);
      } else {
        console.log(`Task ${task} inserted successfully`);
      }
    });
  });
});

// Close the database connection when done
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Closed the database connection.");
});

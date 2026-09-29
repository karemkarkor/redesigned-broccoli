echo "Starting Acquisition App in Developmet Mode"
echo "==========================================="

if [ ! -f .env.development ]; then
  echo "Error: .env.development file not found"
  echo "Please copy .env.development from the template and update your Neon credentials"
  exit 1

fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker not running!"
  echo "Please start docker and try again"
  exit 1

fi

mkdir -p .db

if ! grep -q ".db/" .gitignore 2>dev/null; then
  echo ".db/" >> .gitignore
  ehco "Added .db to .gitignore"

fi

echo "📦 Building and starting development containers..."
echo "   - Neon Local proxy will create an ephemeral database branch"
echo "   - Application will run with hot reload enabled"
echo ""

# Run migrations with Drizzle
echo "📜 Applying latest schema with Drizzle..."
npm run db:migrate

# Wait for the database to be ready
echo "⏳ Waiting for the database to be ready..."
docker compose -f docker-compose.dev.yml exec db psql -U neon -d neondb -c 'SELECT 1'

# Start development environment
docker compose -f docker-compose.dev.yml up --build

echo ""
echo "🎉 Development environment started!"
echo "   Application: http://localhost:5000"
echo "   Database: postgres://neon:npg@localhost:5432/neondb"
echo ""
echo "To stop the environment, press Ctrl+C or run: docker compose down"
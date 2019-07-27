param([bool] $resetdb = $false)

$env:NODE_ENV = "dev"
$env:DB_USER = "postgres"
$env:DB_PASSWORD = "postgres"
$env:DB_HOST = "localhost"
$env:DB_PORT = "5432"
$env:DB_NAME = "webbasedvideoeditor"

Write-Host 'Installing node modules' -ForegroundColor Green
npm install

Write-Host 'Setting up the database' -ForegroundColor Green
# Run a NodeJS script to create the database if it does not exist
$command = "require('./database/create').createDatabase('$env:DB_NAME', '$env:DB_HOST', '$env:DB_PORT', '$env:DB_USER', '$env:DB_PASSWORD')"
node -e "$command"

# Run the database migration scripts using db-migrate
if ($resetdb) {
    Write-Host 'Resetting database' -ForegroundColor DarkYellow
    db-migrate reset --config ./database/config.json --migrations-dir ./database/migrations
}

db-migrate up --config ./database/config.json --migrations-dir ./database/migrations

#Write-Host 'Starting the web server' -ForegroundColor Green
#node web-server
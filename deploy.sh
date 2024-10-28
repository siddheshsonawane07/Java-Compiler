echo "Switching to branch maain"
git checkout main

echo "Building app"
npm run build

echo "Deploying files to server"
scp -r build/* root@34.134.144.195:/var/www/34.134.144.195/

echo "done"
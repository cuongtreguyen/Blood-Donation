echo "Building app..."
npm run build
echo "Deploy files to server..."
scp -r dist/* root@14.225.205.143:/var/www/html/
echo "Done!"


# //BuTNK4qKYm9wGGaxhYgW    
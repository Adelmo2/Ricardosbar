if %1 == '' goto fim

git add .
git commit -m %1
git push

fim:
PAUSE ""

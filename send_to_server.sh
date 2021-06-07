#!/bin/bash
# A bash script that automates the process of sending the backend code and deplying it to the server
# it uses ssh, thus you need to provide a user name and ip address

cd ~/dictographo ;

cd .. ;

echo " please enter user and server: ex. user@1.1.1.1"
read domain


#echo "Zipping dictographo..."
zip -r dictographo.zip dictographo ;



echo "done"
echo "sending dictographo to server"
scp dictographo.zip  $domain:~ 
echo "done"

rm -v dictographo.zip

echo "overwritting "
ssh $domain "[-d '~/dictographo' ] && \\rm -rvf dictographo; unzip dictographo.zip && cd dictographo/frontend && npm run build && sudo cp -rvf build/* /var/www/html/"



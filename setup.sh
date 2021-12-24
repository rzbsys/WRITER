apt-get update
apt-get upgrade
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
git clone https://github.com/ssut/py-hanspell.git
cd py-hanspell
python3 setup.py install
cd ..

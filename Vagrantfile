# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

   config.vm.box = "ubuntu-14.04"
   config.vm.network "forwarded_port", guest: 8080, host: 8080
   config.vm.provider "virtualbox" do |vb|
     vb.memory = 256
   end

  config.vm.provision "shell", path: "init.sh", run: "once", privileged: false

end

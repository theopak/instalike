Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.provision :shell, :path => "provision.sh"
  config.vm.network "forwarded_port", guest: 6379, host: 6379 # Redis
  config.vm.network "forwarded_port", guest: 8080, host: 8080 # Node.js application
end

class User < ApplicationRecord
    has_many :wins, :dependent => :delete_all
    has_many :losses, :dependent => :delete_all
end

class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :password
  has_many :wins
  has_many :losses
end

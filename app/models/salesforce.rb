class Salesforce
  include ActiveModel::Model

  def initialize(attributes={})
    @client = Databasedotcom::Client.new :host => "login.salesforce.com"
    @client.client_id = "3MVG9fMtCkV6eLhcHZKdKpiBaGRD.nn9APDZwScPrrS1WNk0n7FZxiid9uUSJil3fxRC_jFE1Fk_McVoXI9uu"
    @client.client_secret = ENV["SF_CLIENT_SECRET"]
    @client.authenticate :username=>ENV["SF_USERNAME"], :password=>ENV["SF_PASSWORD"]
  end

  def sobject_list
    @client.list_sobjects
  end

end
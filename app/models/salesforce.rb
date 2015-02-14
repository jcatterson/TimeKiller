class Salesforce
  include ActiveModel::Model

  def initialize(attributes={})
    @databasedotcom = Databasedotcom::Client.new :host => "login.salesforce.com"
    @databasedotcom.client_id = "3MVG9fMtCkV6eLhcHZKdKpiBaGRD.nn9APDZwScPrrS1WNk0n7FZxiid9uUSJil3fxRC_jFE1Fk_McVoXI9uu"
    @databasedotcom.client_secret = ENV["SF_CLIENT_SECRET"]
    @databasedotcom.authenticate :username=>ENV["SF_USERNAME"], :password=>ENV["SF_PASSWORD"]
    byebug
    @restforce = Restforce.new :oauth_token=>@databasedotcom.oauth_token, :instance_url=>@databasedotcom.instance_url
  end

  def sobject_list
    @databasedotcom.list_sobjects
  end
  
  def describe( sobject_name )
  end

end
class Salesforce
  include ActiveModel::Model

  def initialize(attributes={})
    @databasedotcom = Databasedotcom::Client.new :host => "login.salesforce.com"
    @databasedotcom.client_id = "3MVG9fMtCkV6eLhcHZKdKpiBaGRD.nn9APDZwScPrrS1WNk0n7FZxiid9uUSJil3fxRC_jFE1Fk_McVoXI9uu"
    @databasedotcom.client_secret = ENV["SF_CLIENT_SECRET"]
    @databasedotcom.authenticate :username=>ENV["SF_USERNAME"], :password=>ENV["SF_PASSWORD"]
    @restforce = Restforce.tooling :oauth_token=>@databasedotcom.oauth_token, :instance_url=>@databasedotcom.instance_url
  end

  def sobject_list
    @databasedotcom.list_sobjects
  end

  def describe( sobject_name )
    @restforce.get "/services/data/v#{SF_API_VERSION}/sobjects/#{sobject_name}/describe"
  end

  def workflow_rules( sobject_name )
    @restforce.get "/services/data/v#{SF_API_VERSION}/tooling/query/?q=Select+id,name,fullname,metadata+from+WorkflowRule+where+TableEnumOrId=\'#{sobject_name}\'"
  end

  private
    SF_API_VERSION = "33.0"
end
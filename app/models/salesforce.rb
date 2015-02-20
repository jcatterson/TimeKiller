class Salesforce
  include ActiveModel::Model

  def initialize(attributes={})
    #host = 'test.salesforce.com'
    @restforce = Restforce.tooling :client_secret=>ENV["SF_CLIENT_SECRET"],
                                   :client_id=>"3MVG9fMtCkV6eLhcHZKdKpiBaGRD.nn9APDZwScPrrS1WNk0n7FZxiid9uUSJil3fxRC_jFE1Fk_McVoXI9uu",
                                   :username=>ENV["SF_USERNAME"],
                                   :password=>ENV["SF_PASSWORD"]
  end

  def sobject_list
  	sobjects = @restforce.get("/services/data/v#{SF_API_VERSION}/sobjects").body.sobjects
  	list = []
  	sobjects.each do |sobject|
  		list << sobject.name.to_s
  	end
  	list
  end

  def describe( sobject_name )
    @restforce.get( "/services/data/v#{SF_API_VERSION}/sobjects/#{sobject_name}/describe")
  end

  def workflow_rules( sobject_name )
    metadata_query( "Select+id,name,fullname,metadata+from+WorkflowRule+where+TableEnumOrId=\'#{sobject_name}\'" )
  end

  def query( str_query )
    @restforce.get "/services/data/v#{SF_API_VERSION}/query/?q=#{str_query}"
  end

  def metadata_query( str_query )
    @restforce.get "/services/data/v#{SF_API_VERSION}/tooling/query/?q=#{str_query}"
  end

  private
    SF_API_VERSION = "33.0"
end
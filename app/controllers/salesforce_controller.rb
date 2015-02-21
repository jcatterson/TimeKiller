class SalesforceController < ApplicationController

  before_action :login

  def sobject_list
    respond_to do |format|
      format.html
      format.json { render json: @salesforce.sobject_list }
    end
  end

  def describe
    sobject = params["sobject"]
    sobject_described = @salesforce.describe( sobject )
    workflow_rules = @salesforce.workflow_rules sobject
    sf_object = { "sobject"=>sobject_described, "workflowrules"=>workflow_rules}
    respond_to do |format|
      format.html
      format.json { render json: sf_object }
    end
  end

  def query
    query = params["query"]
    res = @salesforce.query( query )
    respond_to do |format|
      format.html
      format.json { render json: res }
    end
  end

  private
    def login
      @salesforce = Salesforce.new
    end
end

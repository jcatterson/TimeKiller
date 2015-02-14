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
    sobject = @salesforce.describe sobject
    respond_to do |format|
      format.html
      format.json { render json: sobject }
    end
  end

  private
    def login
      @salesforce = @salesforce == nil ? Salesforce.new : @salesforce
    end
end

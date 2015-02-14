class SalesforceController < ApplicationController

  before_action :login

  def index
    respond_to do |format|
      format.html
      format.json { render json: @salesforce.sobject_list }
    end
  end

  private
    def login
      @salesforce == nil ? Salesforce.new : @salesforce
    end
end

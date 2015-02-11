class SalesforceController < ApplicationController
  def index
  	@salesforce = Salesforce.new
  end
end

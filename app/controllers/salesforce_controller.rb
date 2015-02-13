class SalesforceController < ApplicationController

  def index
  	@salesforce = Salesforce.new

  	respond_to do |format|
  	  format.html
  	  format.json { render json: @salesforce.sobjects }
  	end
  end
end

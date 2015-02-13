class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #protect_from_forgery with: :exception

	before_filter :verify_sobjects_set
	
	def verify_sobjects_set
		@salesforce = if @salesforce == nil then Salesforce.new else @salesforce end
	end
end

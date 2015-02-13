# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks

task :push, [:message] do |t, args|
  assets_directory = "public/assets"
  existing_assets = Dir.entries( assets_directory )
  sh("rake assets:precompile")
  only_precompiled = Dir.entries( assets_directory )
  only_precompiled = only_precompiled - existing_assets - [".", ".."]
  files_to_commit = only_precompiled.join("#{files_to_commit}/ ")
  sh("git add #{files_to_commit}")
  command = "git commit -m\"#{args['message']}\""
  sh( command )
  sh("git push")
  sh("git push heroku")
  sh("rm #{files_to_commit}")
end
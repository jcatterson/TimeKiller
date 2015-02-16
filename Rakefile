# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)
require_relative "lib/mixins/dir"
Rails.application.load_tasks

task :push, [:message] do |t, args|

  assets_directory = Dir.create_or_mk "public/assets"

  precompiled = precompile_assets assets_directory
  git_add precompiled, assets_directory

  git_commit = "git commit -m\"#{args['message']}\""
  sh( git_commit )
  sh("git push")
  sh("git push heroku")
  Dir.rm_files_in_directory precompiled, assets_directory
end

def git_add files, for_directory
  files_to_commit = Dir.join_files_with_directory_for_path files, for_directory
  puts "The Files:" + files_to_commit.size.to_s
  if files_to_commit.size > 0
    sh("git add #{files_to_commit}")
  end
end

def precompile_assets for_directory
  existing_assets = for_directory.entries
  sh("rake assets:precompile")
  only_precompiled = Dir.entries( for_directory )
  only_precompiled - existing_assets - [".", ".."]
end
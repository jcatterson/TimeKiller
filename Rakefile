# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks

task :push, [:message] do |t, args|

  assets_directory = create_or_mk "public/assets"

  precompiled = precompile_assets assets_directory
  git_add precompiled, assets_directory

  git_commit = "git commit -m\"#{args['message']}\""
  sh( git_commit )
  sh("git push")
  sh("git push heroku")
  rm_files_in_directory precompiled, assets_directory
end

def create_or_mk directory
  if Dir.exists?( directory )
    directory = Dir.new( directory )
  else
    Dir.mkdir directory
    directory = Dir.new directory
  end
end

def git_add files, for_directory
  files_to_commit = join_files_with_directory_for_path files, for_directory
  puts "The Files:" + files_to_commit.size.to_s
  if files_to_commit.size > 0
    sh("git add #{files_to_commit}")
  end
end

def rm_files_in_directory files, directory
  files_to_rm = join_files_with_directory_for_path files, directory
  if files_to_rm.size > 0
    sh("rm #{files_to_rm}")
  end
end

def join_files_with_directory_for_path files, directory
  files_and_folder = files
  if files.size > 0
    files.unshift ""
    files_and_folder = files.join(" #{directory.to_path}/")
    files.shift
  end
  files_and_folder
end

def precompile_assets for_directory
  existing_assets = for_directory.entries
  sh("rake assets:precompile")
  only_precompiled = Dir.entries( for_directory )
  only_precompiled - existing_assets - [".", ".."]
end
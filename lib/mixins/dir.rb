class Dir
  def self.join_files_with_directory_for_path files, directory
    files_and_folder = files
    if files.size > 0
      files.unshift ""
      files_and_folder = files.join(" #{directory.to_path}/")
      files.shift
    end
    files_and_folder
  end

  def self.rm_files_in_directory files, directory
    files_to_rm = join_files_with_directory_for_path files, directory
    if files_to_rm.size > 0
      sh("rm #{files_to_rm}")
    end
  end
  
  def self.create_or_mk directory
    if Dir.exists?( directory )
      directory = Dir.new( directory )
    else
      Dir.mkdir directory
      directory = Dir.new directory
    end
  end

end
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
    files.each do |file_to_rm|
      File.delete "#{directory.to_path}/#{file_to_rm}"
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
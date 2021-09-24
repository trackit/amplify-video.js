class FileExtensionExecption extends Error {
  constructor(message) {
    super(message);
    this.name = 'FileExtensionExecption';
  }
}

export default FileExtensionExecption;

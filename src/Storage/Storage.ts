import BaseStorage from './BaseStorage';

class Storage extends BaseStorage {
  public async put({ filename, file, config }) {
    this.checkFileFormat(file);
    this.config = {
      ...config,
    };
    return this.instance.put(filename, file, this.config);
  }

  public async remove({ filename, config }) {
    this.config = {
      ...config,
    };
    return this.instance.remove(filename, this.config);
  }

  checkFileFormat(file) {
    if (file.type.split('/')[0] !== 'video') {
      this.logger.error(
        `Format is not supported (supported formats:${this.extensions.map(
          (extention) => ` .${extention}`,
        )})`,
      );
      process.exit(1);
    }
  }
}

export default Storage;

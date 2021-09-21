import FileExtensionError from '../Exception/FileExtensionError';
import BaseStorage from './BaseStorage';

class Storage extends BaseStorage {
  public async put({ filename, file, config }) {
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
      throw new FileExtensionError(
        `Format is not supported (supported formats:${this.extensions.map(
          (extention) => ` .${extention}`,
        )})`,
      );
    }
  }
}

export default Storage;

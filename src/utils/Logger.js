// src/utils/Logger.js

class Logger {
    constructor(namespace = "") {
      this.namespace = namespace ? `[${namespace}]` : "";
      // production’da false, diğerlerinde (undefined da dahil) true olacak
      this.enabled = process.env.NODE_ENV === "development";
    }
  
    log(...args) {
      if (this.enabled) {
        console.log(this.namespace, ...args);
      }
    }
  
    info(...args) {
      if (this.enabled) {
        console.info(this.namespace, ...args);
      }
    }
  
    warn(...args) {
      if (this.enabled) {
        console.warn(this.namespace, ...args);
      }
    }
  
    error(...args) {
      if (this.enabled) {
        console.error(this.namespace, ...args);
      }
    }
  }
  
  export default Logger;
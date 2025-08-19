// Servicio de optimización de imágenes para mejorar rendimiento en móviles
class ImageOptimizationService {
  constructor() {
    this.supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
    this.maxWidth = 800;
    this.maxHeight = 600;
    this.quality = 0.8;
  }

  // Comprimir imagen
  async compressImage(file, options = {}) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const { width, height } = this.calculateDimensions(img.width, img.height, options);
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: blob.type }));
            } else {
              reject(new Error('Error al comprimir imagen'));
            }
          },
          options.format || file.type,
          options.quality || this.quality
        );
      };

      img.onerror = () => reject(new Error('Error al cargar imagen'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Calcular dimensiones optimizadas
  calculateDimensions(originalWidth, originalHeight, options = {}) {
    const maxWidth = options.maxWidth || this.maxWidth;
    const maxHeight = options.maxHeight || this.maxHeight;
    
    let { width, height } = { width: originalWidth, height: originalHeight };
    
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
    
    return { width: Math.round(width), height: Math.round(height) };
  }

  // Verificar si el navegador soporta WebP
  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // Obtener formato optimizado
  getOptimizedFormat() {
    if (this.supportsWebP()) {
      return 'image/webp';
    }
    return 'image/jpeg';
  }

  // Optimizar múltiples imágenes
  async optimizeImages(files, options = {}) {
    const optimizedFiles = [];
    
    for (const file of files) {
      if (this.supportedFormats.includes(file.type)) {
        try {
          const optimized = await this.compressImage(file, options);
          optimizedFiles.push(optimized);
        } catch (error) {
          console.warn('Error optimizando imagen:', error);
          optimizedFiles.push(file); // Usar original si falla
        }
      } else {
        optimizedFiles.push(file); // No optimizar formatos no soportados
      }
    }
    
    return optimizedFiles;
  }

  // Crear thumbnail
  async createThumbnail(file, size = 150) {
    return this.compressImage(file, {
      maxWidth: size,
      maxHeight: size,
      quality: 0.7
    });
  }

  // Verificar tamaño de archivo
  isFileTooLarge(file, maxSizeMB = 5) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size > maxSizeBytes;
  }

  // Obtener información de la imagen
  getImageInfo(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          size: file.size,
          type: file.type,
          name: file.name
        });
      };
      img.onerror = () => reject(new Error('Error al obtener información de imagen'));
      img.src = URL.createObjectURL(file);
    });
  }
}

// Exportar instancia singleton
export const imageOptimizationService = new ImageOptimizationService();

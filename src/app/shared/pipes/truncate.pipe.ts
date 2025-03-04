import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  /**
   * Truncates a string to the specified length and appends an ellipsis
   * @param value The string to truncate
   * @param limit The maximum length of the string
   * @param ellipsis The string to append when truncated (default: '...')
   * @returns The truncated string
   */
  transform(value: string, limit: number, ellipsis: string = '...'): string {
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    // Truncate to the limit and remove any partial words
    const truncated = value.substring(0, limit).trim();
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    // If there's a space, truncate at the space to avoid cutting words
    if (lastSpaceIndex > 0 && lastSpaceIndex > limit * 0.7) {
      return truncated.substring(0, lastSpaceIndex) + ellipsis;
    }
    
    return truncated + ellipsis;
  }
}
export class DateHelper {
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

export class StringHelper {
  static capitalize(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

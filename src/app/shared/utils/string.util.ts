export class StringUtils {

    public captilizeStrings(str: string): string {
        let result = str.replace(/[-_]/g, ' ');
        result = result.replace(/([a-z])([A-Z])/g, '$1 $2');

        result = result
            .split(' ')
            .filter(Boolean)
            .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
            .join(' ');

        return result;
    }

}

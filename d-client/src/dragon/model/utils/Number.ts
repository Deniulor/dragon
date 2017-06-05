module dragon.utils {
	export module number {
		export function isNumber(num: any) {
			return parseFloat(num).toString() != "NaN"
		}
	}
}
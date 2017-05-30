module dragon.utils {
	export module string {
		export function format(str: string, ...param: any[]) {
			let args = abstractParam([], param);
			let result = str;
			for (let i = 0; i < args.length; i++)
				if (args[i] !== undefined)
					result = result.replace(new RegExp("\\{" + i + "\\}", "g"), args[i])
			return result;
		}

		function abstractParam(rnt: any[], args) {
			if (args instanceof Array)
				for (let i = 0; i < args.length; ++i)
					abstractParam(rnt, args[i])
			else
				rnt.push(args);
			return rnt;
		}
	}
}
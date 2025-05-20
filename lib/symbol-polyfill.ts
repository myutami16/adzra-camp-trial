// This polyfill ensures Symbol support for older environments
// and provides Symbol.description handling

// Only add polyfill if Symbol is not already defined
if (typeof Symbol === "undefined") {
	console.warn("Symbol not defined in this environment, adding polyfill");

	// Simple Symbol polyfill
	(global as any).Symbol = function Symbol(description?: string): symbol {
		const sym = Object.create(null);

		// Store the description
		Object.defineProperty(sym, "description", {
			value: description,
			writable: false,
			enumerable: false,
			configurable: false,
		});

		// Custom toString method
		Object.defineProperty(sym, "toString", {
			value: function () {
				return `Symbol(${description || ""})`;
			},
			writable: false,
			enumerable: false,
			configurable: false,
		});

		return sym as unknown as symbol;
	};
}

// Ensure Symbol.for and Symbol.keyFor are available
if (typeof Symbol.for === "undefined") {
	const symbolRegistry: Record<string, symbol> = {};

	Symbol.for = function (key: string): symbol {
		if (symbolRegistry[key]) {
			return symbolRegistry[key];
		}

		const sym = Symbol(key);
		symbolRegistry[key] = sym;
		return sym;
	};

	Symbol.keyFor = function (sym: symbol): string | undefined {
		for (const key in symbolRegistry) {
			if (symbolRegistry[key] === sym) {
				return key;
			}
		}
		return undefined;
	};
}

// Add Symbol.description property support if needed
if (!("description" in Symbol.prototype)) {
	Object.defineProperty(Symbol.prototype, "description", {
		get: function () {
			const string = this.toString();
			const match = /Symbol\((.*)\)/.exec(string);
			if (!match) return undefined;
			const description = match[1];
			return description === "" ? undefined : description;
		},
	});
}

export {};

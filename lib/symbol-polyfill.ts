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

		// Custom toString method - with error handling
		Object.defineProperty(sym, "toString", {
			value: function () {
				try {
					return `Symbol(${description || ""})`;
				} catch (e) {
					return "Symbol()";
				}
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
		try {
			if (symbolRegistry[key]) {
				return symbolRegistry[key];
			}

			const sym = Symbol(key);
			symbolRegistry[key] = sym;
			return sym;
		} catch (e) {
			console.error("Error in Symbol.for:", e);

			return Symbol("[registry-error]");
		}
	};

	Symbol.keyFor = function (sym: symbol): string | undefined {
		try {
			for (const key in symbolRegistry) {
				if (symbolRegistry[key] === sym) {
					return key;
				}
			}
			return undefined;
		} catch (e) {
			console.error("Error in Symbol.keyFor:", e);
			return undefined;
		}
	};
}

// Add Symbol.description property support if needed
if (!("description" in Symbol.prototype)) {
	Object.defineProperty(Symbol.prototype, "description", {
		get: function () {
			try {
				const string = this.toString();
				const match = /Symbol\((.*)\)/.exec(string);
				if (!match) return undefined;
				const description = match[1];
				return description === "" ? undefined : description;
			} catch (e) {
				console.error("Error accessing Symbol description:", e);
				return undefined;
			}
		},
	});
}

// Safely override Symbol.prototype.toString if it exists to handle potential errors
try {
	const originalToString = Symbol.prototype.toString;
	Symbol.prototype.toString = function () {
		try {
			return originalToString.call(this);
		} catch (e) {
			console.error("Error in Symbol.toString:", e);
			return "Symbol()";
		}
	};
} catch (e) {
	console.error("Could not patch Symbol.toString:", e);
}

// Add a safe conversion method to help with string conversion issues
if (!Symbol.safeToString) {
	(Symbol as any).safeToString = function (symbol: any): string {
		if (typeof symbol !== "symbol") return String(symbol);

		try {
			if (symbol.description !== undefined) {
				return symbol.description || "[Symbol]";
			}

			const stringValue = String(symbol);
			const match = /Symbol\((.*)\)/.exec(stringValue);
			if (match) {
				return match[1] || "[Symbol]";
			}

			return "[Symbol]";
		} catch (e) {
			console.error("Failed to safely convert symbol to string:", e);
			return "[Symbol]";
		}
	};
}

export {};

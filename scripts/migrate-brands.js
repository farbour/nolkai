"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var brands_1 = require("../src/config/brands");
// file path: scripts/migrate-brands.ts
var dotenv_1 = require("dotenv");
var supabase_js_1 = require("@supabase/supabase-js");
var dns_1 = require("dns");
var node_fetch_1 = require("node-fetch");
var path_1 = require("path");
var brandAnalysisStorage_1 = require("../src/utils/brandAnalysisStorage");
// Configure DNS to use Google's DNS servers
dns_1.default.setServers(['8.8.8.8', '8.8.4.4']);
// Load environment variables from .env.local
var result = (0, dotenv_1.config)({ path: (0, path_1.resolve)(process.cwd(), '.env.local') });
if (!result.parsed) {
    console.error('Failed to load .env.local file');
    process.exit(1);
}
var supabaseUrl = 'https://najvmybykjrelvifyacc.supabase.co';
var supabaseServiceRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hanZteWJ5a2pyZWx2aWZ5YWNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTk4MjI5MCwiZXhwIjoyMDU1NTU4MjkwfQ.enEBdKKaD9kQOCLX4iggmZEWdaHvNnG5O1TQW7l_Jxw';
if (!supabaseServiceRole) {
    console.error('Missing required Supabase service role key');
    process.exit(1);
}
console.log('Supabase URL:', supabaseUrl);
console.log('Service Role Key (first 10 chars):', supabaseServiceRole.slice(0, 10) + '...');
// Create Supabase client with custom fetch implementation
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceRole, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
    global: {
        // @ts-expect-error - node-fetch types are incompatible with Supabase's fetch type
        fetch: node_fetch_1.default,
    },
});
var brandTable = 'brands';
function createBrand(brand) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabase
                        .from(brandTable)
                        .insert([
                        __assign(__assign({}, brand), { created_at: new Date().toISOString(), updated_at: new Date().toISOString() }),
                    ])
                        .select()
                        .single()];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    return [2 /*return*/, data];
            }
        });
    });
}
function migrateBrands() {
    return __awaiter(this, void 0, void 0, function () {
        var sqlError, createTableSQL, createError, _i, brands_2, brand, sanitizedName, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting brand migration...');
                    console.log("Using Supabase URL: ".concat(supabaseUrl));
                    return [4 /*yield*/, supabase
                            .from(brandTable)
                            .select('id')
                            .limit(1)];
                case 1:
                    sqlError = (_a.sent()).error;
                    if (!sqlError) return [3 /*break*/, 3];
                    console.log('Table does not exist, creating it...');
                    createTableSQL = "\n      CREATE TABLE IF NOT EXISTS brands (\n        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n        name TEXT NOT NULL,\n        slug TEXT NOT NULL UNIQUE,\n        info JSONB,\n        is_analyzing BOOLEAN DEFAULT false,\n        error TEXT,\n        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,\n        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL\n      );\n\n      CREATE INDEX IF NOT EXISTS brands_slug_idx ON brands(slug);\n\n      CREATE OR REPLACE FUNCTION update_updated_at_column()\n      RETURNS TRIGGER AS $$\n      BEGIN\n        NEW.updated_at = TIMEZONE('utc'::text, NOW());\n        RETURN NEW;\n      END;\n      $$ language 'plpgsql';\n\n      DROP TRIGGER IF EXISTS update_brands_updated_at ON brands;\n      CREATE TRIGGER update_brands_updated_at\n        BEFORE UPDATE ON brands\n        FOR EACH ROW\n        EXECUTE FUNCTION update_updated_at_column();\n    ";
                    return [4 /*yield*/, supabase.rpc('exec_sql', { sql: createTableSQL })];
                case 2:
                    createError = (_a.sent()).error;
                    if (createError) {
                        console.error('Failed to create table:', createError);
                        process.exit(1);
                    }
                    console.log('Table created successfully');
                    _a.label = 3;
                case 3:
                    _i = 0, brands_2 = brands_1.brands;
                    _a.label = 4;
                case 4:
                    if (!(_i < brands_2.length)) return [3 /*break*/, 11];
                    brand = brands_2[_i];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    sanitizedName = (0, brandAnalysisStorage_1.sanitizeBrandName)(brand);
                    return [4 /*yield*/, createBrand({
                            name: sanitizedName,
                            slug: sanitizedName,
                        })];
                case 6:
                    _a.sent();
                    console.log("\u2713 Migrated brand: ".concat(brand));
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    if (error_1 instanceof Error && error_1.message.includes('duplicate key')) {
                        console.log("\u26A0 Brand already exists: ".concat(brand));
                    }
                    else {
                        console.error("\u2717 Failed to migrate brand ".concat(brand, ":"), error_1);
                    }
                    return [3 /*break*/, 8];
                case 8: 
                // Add a small delay between requests
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 9:
                    // Add a small delay between requests
                    _a.sent();
                    _a.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 4];
                case 11:
                    console.log('Brand migration completed');
                    return [2 /*return*/];
            }
        });
    });
}
migrateBrands().catch(console.error);

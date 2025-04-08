import { reactive } from "vue";

interface Search {
    query: string;
    results: any[];
    isLoading: boolean;
    error: any;
    close:boolean;
}


export const search = reactive<Search>({
    query: "",
    results: [],
    isLoading: false,
    error: null,
    close:false
});

export function setQuery(query: string) {
    search.query = query;
}
export function setResults(results: any[]) {
    search.results = results;
}
export function setLoading(isLoading: boolean) {
    search.isLoading = isLoading;
}
export function setError(error: any) {
    search.error = error;
}

export function setClose(close: boolean) {
    search.close = close;
}

export function resetSearch() {
    search.query = "";
    search.results = [];
    search.isLoading = false;
    search.error = null;
}
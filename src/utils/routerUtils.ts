import type { useRoute, useRouter } from "vue-router";

export function updateQueryParam(router: ReturnType<typeof useRouter>, route: ReturnType<typeof useRoute>,
                                 key: string, value: string | undefined) {
    if (route.query[key] === value) {
        return;
    }
    router.push({
        name: route.name, query: {
            ...route.query, [key]: value || undefined
        }
    });
}

export function replaceQueryParam(router: ReturnType<typeof useRouter>, route: ReturnType<typeof useRoute>,
                                 key: string, value: string | undefined) {
    if (route.query[key] === value) {
        return;
    }
    router.push({
        name: route.name, query: { [key]: value || undefined }
    });
}

export function updateQueryParams(
    router: ReturnType<typeof useRouter>,
    route: ReturnType<typeof useRoute>,
    params: Record<string, string | undefined>
) {
    const newQuery = { ...route.query };

    for (const key in params) {
        const val = params[key];
        if (val == null || val.trim() === '') {
            // Delete the query corresponding to the null value
            delete newQuery[key];
        } else {
            newQuery[key] = val;
        }
    }

    // Compare the current route.query
    const isEqual = Object.keys(newQuery).length === Object.keys(route.query).length &&
        Object.keys(newQuery).every(k => newQuery[k] === route.query[k]);

    if (!isEqual) {
        router.push({
            name: route.name ?? undefined,
            query: newQuery
        });
    }
}
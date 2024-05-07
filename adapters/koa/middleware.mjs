import * as elmPages from "./elm-pages.mjs";

export default async (ctx, next) => {
    try {
        const { headers, statusCode, body, kind } = await elmPages.render(reqToElmPagesJson(ctx.request))
        ctx.response.status = statusCode
        for (const key in headers) {
            ctx.set(key, headers[key]);
        }
        if (kind === "bytes") {
            ctx.response.body = Buffer.from(body)
        } else {
            ctx.response.body = body
        }
    } catch (error) {
        console.log("Encountered error serving request", ctx.request, error)
        ctx.response.status = 500
        // this can be styled, or taken out of a nice .html error file
        ctx.response.body = "<body><h1>Error</h1><pre>Unexpected Error</pre></body>"
    } finally {
        next()
    }
}

const reqToElmPagesJson = (req) => {
    const url = `${req.protocol}://${req.host}${req.originalUrl}`;
    return {
        requestTime: Math.round(new Date().getTime()),
        method: req.method,
        headers: req.headers,
        rawUrl: url,
        body: req.body,
        multiPartFormData: null,
    };
};
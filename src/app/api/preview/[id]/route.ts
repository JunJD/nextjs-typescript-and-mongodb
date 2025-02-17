import { getIssue } from "@/actions/issue"
import { Issue } from "@/schemas"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // 获取预览参数
        const searchParams = request.nextUrl.searchParams
        const isPreview = searchParams.get('preview') === '1'
        const openid = searchParams.get('openid')

        if (!openid && !isPreview) {
            return new NextResponse('openid not found', { status: 404 })
        }
        
        const result = await getIssue(params.id)
        if (!('data' in result) || !result.data) {
            return new NextResponse('Not Found', { status: 404 })
        }

        const data: Issue = result.data as Issue
        const content = data.content || {}
        
        // 只在非预览模式下检查发布状态
        if (!isPreview && data.status !== 'published') {
            return new NextResponse('Not Found', { status: 404 })
        }

        // 生成完整的 HTML
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title || '预览'}</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="/bootstrap-5.3.3-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="/bootstrap-5.3.3-dist/css/fix.css">
    <style>
        ${content.css || ''}
        ${isPreview ? `
        /* 预览模式水印 */
        body::before {
            content: "预览模式";
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(255, 0, 0, 0.1);
            color: red;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 9999;
        }
        ` : ''}
    </style>
</head>
<body>
    ${content.html || ''}
    ${isPreview ? `
    <div class="preview-banner" style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        text-align: center;
        padding: 8px;
        font-size: 14px;
    ">
        预览模式 - 该内容尚未发布
    </div>
    ` : ''}
    <!-- Bootstrap JS -->
    <script src="/bootstrap-5.3.3-dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`

        return new NextResponse(html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        })
    } catch (error) {
        console.error('Preview error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 
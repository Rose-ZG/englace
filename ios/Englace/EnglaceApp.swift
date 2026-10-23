import SwiftUI
import WebKit
@main struct EnglaceApp: App {
    var body: some Scene { WindowGroup { LearningView() } }
}
final class LocalResources: NSObject, WKURLSchemeHandler {
    func webView(_ webView: WKWebView, start task: WKURLSchemeTask) {
        guard let url = task.request.url, url.host == "app", let root = Bundle.main.resourceURL?.appendingPathComponent("Web") else { task.didFailWithError(URLError(.badURL)); return }
        let name = url.path == "/" ? "index.html" : String(url.path.dropFirst())
        let file = root.appendingPathComponent(name).standardizedFileURL
        guard file.path.hasPrefix(root.standardizedFileURL.path + "/"), let data = try? Data(contentsOf: file) else { task.didFailWithError(URLError(.fileDoesNotExist)); return }
        let types = ["html":"text/html", "js":"text/javascript", "css":"text/css", "json":"application/json", "svg":"image/svg+xml", "png":"image/png", "wav":"audio/wav", "txt":"text/plain"]
        task.didReceive(URLResponse(url: url, mimeType: types[file.pathExtension] ?? "application/octet-stream", expectedContentLength: data.count, textEncodingName: ["html","js","css","json","svg","txt"].contains(file.pathExtension) ? "utf-8" : nil))
        task.didReceive(data); task.didFinish()
    }
    func webView(_ webView: WKWebView, stop task: WKURLSchemeTask) {}
}
struct LearningView: UIViewRepresentable {
    func makeCoordinator() -> Coordinator { Coordinator() }
    func makeUIView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()
        config.setURLSchemeHandler(LocalResources(), forURLScheme: "englace")
        config.websiteDataStore = .default(); config.allowsInlineMediaPlayback = true
        let view = WKWebView(frame: .zero, configuration: config)
        view.navigationDelegate = context.coordinator; view.uiDelegate = context.coordinator
        view.load(URLRequest(url: URL(string: "englace://app/")!)); return view
    }
    func updateUIView(_ view: WKWebView, context: Context) {}
    final class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate {
        func webView(_ webView: WKWebView, decidePolicyFor action: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            guard let url = action.request.url else { decisionHandler(.cancel); return }
            if url.scheme == "englace" && url.host == "app" { decisionHandler(.allow); return }
            if action.targetFrame?.isMainFrame == false && url.scheme == "https" && url.host == "player.bilibili.com" { decisionHandler(.allow); return }
            decisionHandler(.cancel); if url.scheme == "https" { UIApplication.shared.open(url) }
        }
        func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) { present(message, confirm: false) { _ in completionHandler() } }
        func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) { present(message, confirm: true, done: completionHandler) }
        private func present(_ message: String, confirm: Bool, done: @escaping (Bool) -> Void) {
            guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene, let root = scene.windows.first(where: { $0.isKeyWindow })?.rootViewController else { done(false); return }
            let dialog = UIAlertController(title: "英格雷斯", message: message, preferredStyle: .alert)
            if confirm { dialog.addAction(UIAlertAction(title: "取消", style: .cancel) { _ in done(false) }) }
            dialog.addAction(UIAlertAction(title: "确定", style: .default) { _ in done(true) }); root.present(dialog, animated: true)
        }
    }
}

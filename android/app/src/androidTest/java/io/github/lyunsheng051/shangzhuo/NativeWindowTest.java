package io.github.lyunsheng051.shangzhuo;

import static org.junit.Assert.*;

import android.graphics.Bitmap;
import android.os.SystemClock;
import android.view.View;
import android.view.Window;
import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import java.io.File;
import java.io.FileOutputStream;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class NativeWindowTest {
    private void assertNoTitleBar(MainActivity activity) {
        assertNull("原生 ActionBar 不应占据网页上方", activity.getSupportActionBar());
        assertFalse(activity.getWindow().hasFeature(Window.FEATURE_ACTION_BAR));
        assertTrue(activity.getWindow().hasFeature(Window.FEATURE_NO_TITLE));
        View title = activity.getWindow().getDecorView().findViewById(android.R.id.title);
        assertTrue("窗口标题不应显示", title == null || !title.isShown());
    }

    private String js(ActivityScenario<MainActivity> scenario, String script) throws Exception {
        AtomicReference<String> result = new AtomicReference<>();
        CountDownLatch done = new CountDownLatch(1);
        scenario.onActivity(activity -> {
            assertNotNull("WebView 应成功启动", activity.getBridge());
            activity.getBridge().getWebView().evaluateJavascript(script, value -> {
                result.set(value);
                done.countDown();
            });
        });
        assertTrue("等待网页响应超时", done.await(10, TimeUnit.SECONDS));
        return result.get();
    }

    private void awaitPage(ActivityScenario<MainActivity> scenario) throws Exception {
        long deadline = SystemClock.elapsedRealtime() + 30000;
        while (SystemClock.elapsedRealtime() < deadline) {
            if ("true".equals(js(scenario, "!!document.querySelector('[data-testid=exit-app]') && !!document.querySelector('h1')"))) return;
            SystemClock.sleep(200);
        }
        fail("页面或安卓退出入口未加载");
    }

    private void screenshot(String name) throws Exception {
        SystemClock.sleep(500);
        File directory = InstrumentationRegistry.getInstrumentation().getTargetContext().getExternalFilesDir("native-ui");
        assertNotNull(directory);
        Bitmap bitmap = InstrumentationRegistry.getInstrumentation().getUiAutomation().takeScreenshot();
        assertNotNull(bitmap);
        try (FileOutputStream output = new FileOutputStream(new File(directory, name))) {
            assertTrue(bitmap.compress(Bitmap.CompressFormat.PNG, 100, output));
        } finally { bitmap.recycle(); }
    }

    @Test
    public void launchAndRecreateWithoutNativeTitleBar() throws Exception {
        try (ActivityScenario<MainActivity> scenario = ActivityScenario.launch(MainActivity.class)) {
            awaitPage(scenario);
            scenario.onActivity(this::assertNoTitleBar);
            screenshot("landscape-home.png");
            scenario.recreate();
            awaitPage(scenario);
            scenario.onActivity(this::assertNoTitleBar);
        }
    }

    @Test
    public void exitCanCancelAndFinishWithoutClearingStorage() throws Exception {
        try (ActivityScenario<MainActivity> scenario = ActivityScenario.launch(MainActivity.class)) {
            awaitPage(scenario);
            assertEquals("true", js(scenario, "(() => { const r = document.querySelector('[data-testid=exit-app]').getBoundingClientRect(); return r.width > 0 && r.top >= 0 && r.bottom <= innerHeight; })()"));
            js(scenario, "document.querySelector('[data-testid=exit-app]').click()");
            assertEquals("true", js(scenario, "document.querySelector('.exit-dialog').open"));
            screenshot("exit-dialog.png");
            js(scenario, "document.querySelector('[data-testid=cancel-exit]').click()");
            assertEquals("false", js(scenario, "document.querySelector('.exit-dialog').open"));
            js(scenario, "localStorage.setItem('exit-regression', 'keep'); document.querySelector('[data-testid=exit-app]').click()");
            AtomicReference<MainActivity> activity = new AtomicReference<>();
            scenario.onActivity(activity::set);
            // 退出会销毁 Activity，不能等待依赖该 WebView 的 JS 回调。
            scenario.onActivity(a -> a.getBridge().getWebView().evaluateJavascript("document.querySelector('[data-testid=confirm-exit]').click()", null));
            long deadline = SystemClock.elapsedRealtime() + 10000;
            while (!activity.get().isFinishing() && SystemClock.elapsedRealtime() < deadline) SystemClock.sleep(100);
            assertTrue("确认退出应关闭 Activity", activity.get().isFinishing());
        }
        try (ActivityScenario<MainActivity> scenario = ActivityScenario.launch(MainActivity.class)) {
            awaitPage(scenario);
            assertEquals("\"keep\"", js(scenario, "localStorage.getItem('exit-regression')"));
            js(scenario, "localStorage.removeItem('exit-regression')");
        }
    }
}

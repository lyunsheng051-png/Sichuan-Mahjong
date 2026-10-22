package io.github.lyunsheng051.shangzhuo;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // 在 AppCompat 创建窗口前切换到无标题栏主题，防止启动背景留在标题栏中。
        SplashScreen.installSplashScreen(this);
        // 保留系统栏，由 Capacitor 原生安全区处理避开刘海与手势区域。
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
    }
}

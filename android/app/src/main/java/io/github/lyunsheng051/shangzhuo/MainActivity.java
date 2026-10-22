package io.github.lyunsheng051.shangzhuo;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // 保留系统栏，由 Capacitor 原生安全区处理避开刘海与手势区域。
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
    }
}

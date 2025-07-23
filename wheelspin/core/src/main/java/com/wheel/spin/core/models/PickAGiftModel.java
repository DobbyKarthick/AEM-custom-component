package com.wheel.spin.core.models;

import com.adobe.cq.wcm.core.components.models.Component;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import java.util.List;

@Model(
    adaptables = Resource.class,
    resourceType = "wheelspin/components/pick-gift",
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class PickAGiftModel implements Component {

    private static final Logger LOGGER = LoggerFactory.getLogger(PickAGiftModel.class);

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String subtitle;

    @ValueMapValue
    private boolean autoOpen;

    @ValueMapValue
    private boolean showCloseButton;

    @ValueMapValue
    private int animationDuration;

    @ValueMapValue
    private String variant;

    @ValueMapValue
    private String size;

    @ValueMapValue
    private List<PrizeItem> prizes;

    @PostConstruct
    protected void init() {
        LOGGER.debug("PickAGiftModel initialized.");
        LOGGER.debug("Title: {}", title);
        LOGGER.debug("Subtitle: {}", subtitle);
        LOGGER.debug("Auto Open: {}", autoOpen);
        LOGGER.debug("Show Close Button: {}", showCloseButton);
        LOGGER.debug("Animation Duration: {}", animationDuration);
        LOGGER.debug("Variant: {}", variant);
        LOGGER.debug("Size: {}", size);
        if (prizes != null) {
            LOGGER.debug("Prizes count: {}", prizes.size());
            for (int i = 0; i < prizes.size(); i++) {
                PrizeItem prize = prizes.get(i);
                LOGGER.debug("Prize {}: Text={}, Value={}, Color={}, Icon={}", i, prize.getText(), prize.getValue(), prize.getColor(), prize.getIcon());
            }
        } else {
            LOGGER.debug("Prizes: null");
        }
    }

    public String getTitle() {
        return title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public boolean isAutoOpen() {
        return autoOpen;
    }

    public boolean isShowCloseButton() {
        return showCloseButton;
    }

    public int getAnimationDuration() {
        return animationDuration;
    }

    public String getVariant() {
        return variant;
    }

    public String getSize() {
        return size;
    }

    public List<PrizeItem> getPrizes() {
        return prizes;
    }

    // Nested Sling Model for multifield items
    @Model(
        adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
    )
    public static class PrizeItem {
        @ValueMapValue
        private String text;
        @ValueMapValue
        private String value;
        @ValueMapValue
        private String color;
        @ValueMapValue
        private String icon;

        public String getText() {
            return text;
        }

        public String getValue() {
            return value;
        }

        public String getColor() {
            return color;
        }

        public String getIcon() {
            return icon;
        }
    }
} 
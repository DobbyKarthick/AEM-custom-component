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
    resourceType = "wheelspin/components/scratch-card",
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class ScratchCardModel implements Component {

    private static final Logger LOGGER = LoggerFactory.getLogger(ScratchCardModel.class);

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String instructions;

    @ValueMapValue
    private int cardWidth;

    @ValueMapValue
    private int cardHeight;

    @ValueMapValue
    private int brushRadius;

    @ValueMapValue
    private String scratchColor;

    @ValueMapValue
    private String scratchPattern;

    @ValueMapValue
    private int revealThreshold;

    @ValueMapValue
    private String resetButtonText;

    @ValueMapValue
    private List<PrizeItem> prizes;

    @PostConstruct
    protected void init() {
        LOGGER.debug("ScratchCardModel initialized.");
        LOGGER.debug("Title: {}", title);
        LOGGER.debug("Instructions: {}", instructions);
        LOGGER.debug("Card Width: {}", cardWidth);
        LOGGER.debug("Card Height: {}", cardHeight);
        LOGGER.debug("Brush Radius: {}", brushRadius);
        LOGGER.debug("Scratch Color: {}", scratchColor);
        LOGGER.debug("Scratch Pattern: {}", scratchPattern);
        LOGGER.debug("Reveal Threshold: {}", revealThreshold);
        LOGGER.debug("Reset Button Text: {}", resetButtonText);
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

    public String getInstructions() {
        return instructions;
    }

    public int getCardWidth() {
        return cardWidth;
    }

    public int getCardHeight() {
        return cardHeight;
    }

    public int getBrushRadius() {
        return brushRadius;
    }

    public String getScratchColor() {
        return scratchColor;
    }

    public String getScratchPattern() {
        return scratchPattern;
    }

    public int getRevealThreshold() {
        return revealThreshold;
    }

    public String getResetButtonText() {
        return resetButtonText;
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
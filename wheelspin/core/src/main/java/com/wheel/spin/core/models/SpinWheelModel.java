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
    resourceType = "wheelspin/components/spin-wheel",
    defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
)
public class SpinWheelModel implements Component {

    private static final Logger LOGGER = LoggerFactory.getLogger(SpinWheelModel.class);

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String buttonText;

    @ValueMapValue
    private String spinningText;

    @ValueMapValue
    private int wheelSize;

    @ValueMapValue
    private int animationDuration;

    @ValueMapValue
    private int minRevolutions;

    @ValueMapValue
    private int maxRevolutions;

    @ValueMapValue
    private String variant;

    @ValueMapValue
    private String size;

    @ValueMapValue
    private List<SegmentItem> segments;

    @PostConstruct
    protected void init() {
        LOGGER.debug("SpinWheelModel initialized.");
        LOGGER.debug("Title: {}", title);
        LOGGER.debug("Button Text: {}", buttonText);
        LOGGER.debug("Spinning Text: {}", spinningText);
        LOGGER.debug("Wheel Size: {}", wheelSize);
        LOGGER.debug("Animation Duration: {}", animationDuration);
        LOGGER.debug("Min Revolutions: {}", minRevolutions);
        LOGGER.debug("Max Revolutions: {}", maxRevolutions);
        LOGGER.debug("Variant: {}", variant);
        LOGGER.debug("Size: {}", size);
        if (segments != null) {
            LOGGER.debug("Segments count: {}", segments.size());
            for (int i = 0; i < segments.size(); i++) {
                SegmentItem segment = segments.get(i);
                LOGGER.debug("Segment {}: Text={}, Color={}", i, segment.getText(), segment.getColor());
            }
        } else {
            LOGGER.debug("Segments: null");
        }
    }

    public String getTitle() {
        return title;
    }

    public String getButtonText() {
        return buttonText;
    }

    public String getSpinningText() {
        return spinningText;
    }

    public int getWheelSize() {
        return wheelSize;
    }

    public int getAnimationDuration() {
        return animationDuration;
    }

    public int getMinRevolutions() {
        return minRevolutions;
    }

    public int getMaxRevolutions() {
        return maxRevolutions;
    }

    public String getVariant() {
        return variant;
    }

    public String getSize() {
        return size;
    }

    public List<SegmentItem> getSegments() {
        return segments;
    }

    // Nested Sling Model for multifield items
    @Model(
        adaptables = Resource.class,
        defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL
    )
    public static class SegmentItem {
        @ValueMapValue
        private String text;
        @ValueMapValue
        private String color;

        public String getText() {
            return text;
        }

        public String getColor() {
            return color;
        }
    }
} 